import React from "react";
import styled from "styled-components";

import uniq from "lodash.uniq";

function extractEmails(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}

function ContactsArea({ onChange, placeholder = "Inserisci qui i contatti" }) {
  const handleChange = e => {
    const text = e.target.value;
    const emails = extractEmails(text);
    onChange(uniq(emails));
  };

  return (
    <Container>
      <textarea onChange={handleChange} placeholder={placeholder} />
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
