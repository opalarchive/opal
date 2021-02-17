export interface Template {
  body: string;
  problem: string;
  reply: string;
  tag: string;
}

export const JSONTemplate: Template = {
  body: `[ _problems(, )_ ]`,
  problem: `{
\t"author": _author_,
\t"category": _category_,
\t"difficulty": _difficulty_,
\t"replies": [ _replies(, )_ ],
\t"tags": [ _tags(, )_ ],
\t"text": _text_
\t"title": _title_,
\t"votes": _votes_
}`,
  reply: `{
\t\t"author" : _author_,
\t\t"lastEdit" : _lastEdit_,
\t\t"text" : _text_,
\t\t"time" : _time_,
\t\t"type" : _type_
\t}`,
  tag: `_text_`,
};
