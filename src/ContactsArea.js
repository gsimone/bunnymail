import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import uniq from "lodash.uniq";

function extractEmails(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}

function ContactsArea({ autoFocus, onChange, placeholder = "Inserisci qui i contatti" }) {
  const handleChange = e => {
    const text = e.target.value;
    const emails = extractEmails(text);
    onChange(uniq(emails));
  };

  const area = useRef()

  useEffect(() => {
    if (autoFocus) {
      area.current.focus()
    }
  }, [autoFocus])

  return (
    <Container>
      <textarea ref={area} onChange={handleChange} placeholder={placeholder} />
    </Container>
  );
}

const Container = styled.div`
  height: 100%;

  textarea {
    width: 100%;
    height: 100%;
  }
`;

export default ContactsArea;
