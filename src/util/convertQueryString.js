exports.convertToQueryString = (query) => {
  const { id, timeRange, fields } = query;
  const since = timeRange.since;
  const until = timeRange.until;

  const encodedId = encodeURIComponent(id);
  const encodedSince = encodeURIComponent(since);
  const encodedUntil = encodeURIComponent(until);
  const encodedFields = encodeURIComponent(JSON.stringify(fields));

  const queryString = `id=${encodedId}&timeRange=%7B%22since%22%3A%22${encodedSince}%22%2C%22until%22%3A%22${encodedUntil}%22%7D&fields=${encodedFields}`;

  return queryString;
};
