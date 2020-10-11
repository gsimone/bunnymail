import React from "react";
import styled from "styled-components";
import { SEPARATORS } from './const'

function copy(str) {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

function Group({ separator, contacts, onDone, done }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    copy(contacts.join(SEPARATORS[separator][0]));

    setCopied(true);
  }, [contacts, setCopied, separator]);

  React.useEffect(() => {
    let t;

    if (copied) {
      t = window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    }

    return () => window.clearTimeout(t);
  }, [copied, setCopied]);

  return (
    <Container done={done}>
      <Contacts>
        {contacts.map(contact => {
          
          return (<>
            <Contact key={contact}>{contact}</Contact>
            <span className="mr-2">{SEPARATORS[separator][0]}</span>
          </>
        )})}
      </Contacts>

      <Toolbar>
        <button onClick={handleCopy}>{copied ? "Copiato!" : "Copia"}</button>
        <button onClick={onDone}>{done ? "Fatto ✓" : "Fatto"}</button>
      </Toolbar>
    </Container>
  );
}

const Container = styled.div`
  margin: 0.5rem;
  border: 1px solid #eee;

  transition: all 0.3s ease;

  ${props =>
    props.done &&
    `
    opacity: .25;
  `}
`;

const Contacts = styled.div`
  font-size: 0.75rem;
  padding: 1rem;
`;

const Contact = styled.div`
  display: inline-block;
  padding: 0.25em;
`;

const Toolbar = styled.div`
  border-top: 1px solid #eee;
  padding: 1rem;

  display: inline-block;

  display: flex;
  align-items: center;
  background-color: #eee;

  > * + * {
    margin-left: 0.5rem;
  }
`;

export default Group;
