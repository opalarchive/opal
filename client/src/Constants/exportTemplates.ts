import { Problem, reply } from "../../../.shared/src";

export interface Template {
  body: string;
  problem: string;
  reply: string;
  tag: string;
}

export const JSONTemplate: Template = {
  body: `[ _problems(, )_ ]`,
  problem: `{
\t"author": "_author_",
\t"category": "_category_",
\t"difficulty": _difficulty_,
\t"replies": [ _replies(, )_ ],
\t"tags": [ _tags(, )_ ],
\t"text": "_text_",
\t"title": "_title_",
\t"votes": _votes_
}`,
  reply: `{
\t\t"author" : "_author_",
\t\t"lastEdit" : _lastEdit_,
\t\t"text" : "_text_",
\t\t"time" : _time_,
\t\t"type" : "_type_"
\t}`,
  tag: `"_text_"`,
};

/*
TODO: add this
*/
export const YAMLTemplate: Template = {
  body: ``,
  problem: ``,
  reply: ``,
  tag: ``,
};

const regex = /_[^_]*_/g;

const exportTag = (template: Template, tag: string) => {
  return template.tag.replace(/_text_/g, tag);
};

const replyVars = [
  "author",
  "lastEdit",
  "text",
  "time",
  "type",
] as (keyof reply)[];

const exportReply = (template: Template, reply: reply) => {
  const normalText = template.reply.split(regex);
  const match = template.reply.match(regex);

  if (!match) {
    return normalText[0];
  }

  let result = normalText[0];

  for (let i = 0; i < match?.length; i++) {
    // normal replace variable name with variable
    replyVars.forEach((replyVar) => {
      if (`_${replyVar}_` === match[i]) {
        const insertedVar = reply[replyVar];

        match[i] =
          typeof insertedVar === "string" ? insertedVar : "" + insertedVar;
      }
    });
    result += match[i] + normalText[i + 1];
  }
  return result;
};

const problemVars = [
  "ind",
  "author",
  "category",
  "difficulty",
  "text",
  "title",
  "votes",
] as (keyof Problem)[];

const exportProblem = (template: Template, problem: Problem) => {
  const normalText = template.problem.split(regex);
  const match = template.problem.match(regex);

  if (!match) {
    return normalText[0];
  }

  let result = normalText[0];

  for (let i = 0; i < match?.length; i++) {
    // normal replace variable name with variable
    problemVars.forEach((problemVar) => {
      if (`_${problemVar}_` === match[i]) {
        let insertedVar = problem[problemVar];
        if (problemVar === "ind") {
          insertedVar = problem[problemVar] + 1;
        }

        match[i] =
          typeof insertedVar === "string" ? insertedVar : "" + insertedVar;
      }
    });

    // replace reply and tag lists with replies and tags
    // _replies(foo)_ uses "foo" as a separator between replies
    // _replies_ would just be a list with no separator
    if (
      !!match[i].match(/^_replies\([\s\S]*\)_$/g) ||
      match[i] === "_replies_"
    ) {
      const separator =
        match[i] === "_replies_"
          ? ""
          : match[i].substring(9, match[i].length - 2);

      match[i] = problem.replies
        .map((reply) => exportReply(template, reply))
        .join(separator);
    } else if (
      !!match[i].match(/^_tags\([\s\S]*\)_$/g) ||
      match[i] === "_tags_"
    ) {
      const separator =
        match[i] === "_tags_" ? "" : match[i].substring(6, match[i].length - 2);

      match[i] = problem.tags
        .map((tag) => exportTag(template, tag))
        .join(separator);
    }

    result += match[i] + normalText[i + 1];
  }
  return result;
};

export const exportBody = (template: Template, problems: Problem[]) => {
  const normalText = template.body.split(regex);
  const match = template.body.match(regex);

  if (!match) {
    return normalText[0];
  }

  let result = normalText[0];

  for (let i = 0; i < match?.length; i++) {
    // _problems(foo)_ or _problems_ (see exportProblem for more details)
    if (
      !!match[i].match(/^_problems\([\s\S]*\)_$/g) ||
      match[i] === "_problems_"
    ) {
      const separator =
        match[i] === "_problems_"
          ? ""
          : match[i].substring(10, match[i].length - 2);

      match[i] = problems
        .map((prob) => exportProblem(template, prob))
        .join(separator);
    }

    result += match[i] + normalText[i + 1];
  }
  return result;
};
