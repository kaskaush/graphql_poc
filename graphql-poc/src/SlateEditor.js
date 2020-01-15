import React, { useCallback, useMemo, useState, useEffect } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor, Node, Text } from "slate";
import { withHistory } from "slate-history";
import { cx, css } from "emotion";
import escapeHTML from "escape-html";
import { jsx } from "slate-hyperscript";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? "white"
              : "#aaa"
            : active
            ? "black"
            : "#ccc"};
        `
      )}
    />
  )
);

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      "material-icons",
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
));

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
));

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        position: relative;
        padding: 1px 18px 17px;
        border-bottom: 2px solid #eee;
      `
    )}
  />
));

export const serialize = node => {
  console.log("node====>", node);
  if (Text.isText(node)) {
    switch (true) {
      case node.bold && node.italic && node.underline:
        return `<strong><em><span style="text-decoration: underline;">${node.text}</span></em></strong>`;
      case node.bold && node.italic:
        return `<strong><em>${node.text}</em></strong>`;
      case node.bold && node.underline:
        return `<strong><span style="text-decoration: underline;">${node.text}</span></strong>`;
      case node.italic && node.underline:
        return `<em><span style="text-decoration: underline;">${node.text}</span></em>`;
      case node.bold:
        return `<strong>${node.text}</strong>`;
      case node.italic:
        return `<em>${node.text}</em>`;
      case node.underline:
        return `<span style="text-decoration: underline;">${node.text}</span>`;
      default:
        return escapeHTML(node.text);
    }
  }

  const children =
    node.children && node.children.map(n => serialize(n)).join("");

  switch (node.type) {
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHTML(node.url)}">${children}</a>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "heading-three":
      return `<h3>${children}</h3>`;
    case "heading-four":
      return `<h4>${children}</h4>`;
    case "heading-five":
      return `<h5>${children}</h5>`;
    case "heading-six":
      return `<h6>${children}</h6>`;
    default:
      return children;
  }
};

export const deserialize = el => {
  debugger;
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  }

  const childrenOne = Array.from(el.childNodes).map(deserialize);

  switch (el.nodeName) {
    case "P":
      return jsx("element", { type: "paragraph" }, childrenOne);
    case "STRONG":
      return {
        type: "paragraph",
        bold: true,
        children: [{ text: childrenOne.join(""), bold: true }]
      };
    case "EM":
      return {
        type: "paragraph",
        italic: true,
        children: [{ text: childrenOne.join(""), italic: true }]
      };
    case "A":
      return jsx(
        "element",
        { type: "link", url: el.getAttribute("href") },
        childrenOne
      );
    default:
      return el.textContent;
  }
};

// TODO: Handle combos of bold,italix,underline etc to deserialize.
const RichTextExample = ({ content, onChange }) => {
  // Usage
  /*  <RichTextExample
  content={"<p><strong><em>Another closing paragraph!</em></strong></p>"}
  onChange={value => handleOnEditorChange(value)}
/> */
  const [value, setValue] = useState(initialValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const setDeserializedValue = content => {
    let parser = new DOMParser();
    let docBody = parser.parseFromString(content, "text/html").body;
    let valueToSet = [];
    for (let i = 0; i < docBody.childElementCount; i++) {
      valueToSet.push(deserialize(docBody.childNodes[i]));
    }
    console.log("valuetoset array========>", valueToSet);
    setValue(valueToSet);
  };

  const getInitialValue = content => {
    if (content) {
      setDeserializedValue(content);
    } else {
      return initialValue;
    }
  };

  useEffect(() => {
    getInitialValue(content);
  }, [content]);

  const setSerializedValue = val => {
    let serializedStr = "";
    for (let i = 0; i < val.length; i++) {
      serializedStr += serialize(val[i]);
    }
    onChange(serializedStr);
    setValue(val);
  };

  return (
    <div
      className="slate-editor-component"
      style={{ border: "2px solid #eee", borderRadius: "4px", padding: "8px" }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={value => {
          setSerializedValue(value);
        }}
      >
        <Toolbar>
          <MarkButton format="bold" icon="Bold" />
          <MarkButton format="italic" icon="Italic" />
          <MarkButton format="underline" icon="Underline" />
          <BlockButton format="heading-one" icon="H1" />
          <BlockButton format="heading-two" icon="H2" />
          <BlockButton format="heading-three" icon="H3" />
          <BlockButton format="heading-four" icon="H4" />
          <BlockButton format="heading-five" icon="H5" />
          <BlockButton format="heading-six" icon="H6" />
          <BlockButton format="numbered-list" icon="OL" />
          <BlockButton format="bulleted-list" icon="UL" />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter description..."
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
          style={{
            height: "200px",
            overflowY: "auto",
            padding: "18px"
          }}
        />
      </Slate>
    </div>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "heading-five":
      return <h5 {...attributes}>{children}</h5>;
    case "heading-six":
      return <h6 {...attributes}>{children}</h6>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "link":
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }]
  }
];

export default RichTextExample;
