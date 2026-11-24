function detectDelimiter(text) {
  let quoted = false;
  let commas = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') index++;
      else quoted = !quoted;
    } else if (!quoted && character === '\t') {
      return '\t';
    } else if (!quoted && character === ',') {
      commas = true;
    }
  }
  return commas ? ',' : null;
}

function readRecords(text, delimiter) {
  const records = [];
  let fields = [];
  let value = '';
  let quoted = false;
  let afterQuote = false;
  let problem = '';
  let line = 1;
  let startLine = 1;

  function finishField() {
    fields.push(value);
    value = '';
    afterQuote = false;
  }
  function finishRecord() {
    finishField();
    if (problem || fields.some((field) => field.trim() !== '')) {
      records.push({ line: startLine, fields, problem });
    }
    fields = [];
    problem = '';
    startLine = line + 1;
  }

  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          value += '"';
          index++;
        } else {
          quoted = false;
          afterQuote = true;
        }
      } else {
        value += character;
        if (character === '\n') line++;
      }
      continue;
    }
    if (delimiter && character === delimiter) {
      finishField();
    } else if (character === '\n' || character === '\r') {
      finishRecord();
      if (character === '\r' && text[index + 1] === '\n') index++;
      line++;
    } else if (afterQuote) {
      if (character !== ' ') problem = '双引号后只能是分隔符或换行';
    } else if (character === '"') {
      if (value.trim() === '') {
        value = '';
        quoted = true;
      } else {
        problem = '双引号需要包住整个字段';
      }
    } else {
      value += character;
    }
  }
  if (quoted) problem = '双引号未闭合';
  if (value || fields.length || problem) finishRecord();
  return records;
}

function hasHeader(record) {
  const [username, password, label] = record.fields.map((field) => field.trim().toLowerCase());
  return (
    !record.problem &&
    ['账号', '用户名', 'username', 'account', 'email', '邮箱'].includes(username) &&
    ['密码', 'password'].includes(password) &&
    (label === undefined || ['备注', '名称', 'label', 'note', 'remark'].includes(label))
  );
}

/**
 * Parses pasted site credentials without retaining raw rows or including
 * credential contents in diagnostic messages. Passwords keep their exact value.
 */
export function parseAccountBatch(text, { siteId = '', uniformPassword = '', accounts = [] } = {}) {
  const content = String(text ?? '').replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(content);
  const records = readRecords(content, delimiter);
  if (records[0] && hasHeader(records[0])) records.shift();
  const existing = new Set(
    accounts
      .filter((account) => account.siteId === siteId)
      .map((account) =>
        String(account.username ?? '')
          .trim()
          .toLowerCase(),
      ),
  );
  const seen = new Set();
  const inputs = [];
  const rows = records.map((record) => {
    const username = record.problem ? '' : (record.fields[0]?.trim() ?? '');
    const password = record.fields[1] || uniformPassword;
    const label = record.problem ? '' : (record.fields[2]?.trim() ?? '');
    const row = {
      line: record.line,
      username,
      label,
      status: 'invalid',
      message: '',
      passwordSource: record.fields[1] ? 'row' : uniformPassword ? 'uniform' : 'missing',
    };
    if (record.problem) row.message = record.problem;
    else if (record.fields.length > 3) row.message = '最多填写账号、密码、备注三列';
    else if (!siteId) row.message = '请先选择所属站点';
    else if (!username) row.message = '缺少账号';
    else if (!password) row.message = '缺少密码，可填写统一密码';
    else if (existing.has(username.toLowerCase())) {
      row.status = 'existing';
      row.message = '此站点已保存该账号';
    } else if (seen.has(username.toLowerCase())) {
      row.status = 'duplicate';
      row.message = '与前面的有效账号重复';
    } else {
      seen.add(username.toLowerCase());
      row.status = 'valid';
      row.message = '可以保存';
      inputs.push({ siteId, username, password, ...(label ? { label } : {}) });
    }
    return row;
  });
  const counts = { total: rows.length, valid: 0, invalid: 0, duplicate: 0, existing: 0 };
  for (const row of rows) counts[row.status]++;
  counts.skipped = counts.invalid + counts.duplicate + counts.existing;
  return { delimiter, rows, inputs, counts };
}
