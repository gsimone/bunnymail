import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";

import styled from "styled-components";
import "styled-components/macro";

import "./styles.css";

import Group from "./Group";
import ContactsArea from "./ContactsArea";
import { SEPARATORS } from "./const";

function App({ defaultGroupSize = 25, defaultSeparator = 0 }) {
  const [contacts, setContacts] = useState([]);
  const [excluded, setExcluded] = useState([]);
  const [groups, setGroups] = useState([]);

  const [groupSize, setGroupSize] = useState(defaultGroupSize);
  const [separator, setSeparator] = useState(defaultSeparator);

  useEffect(() => {
    window.localStorage.setItem('email-settings', JSON.stringify({groupSize, separator}))
  }, [ groupSize, separator ])

  const [info, setInfo] = useState({
    todo: 0,
    done: 0,
  });

  const toggleDone = React.useCallback(
    (i) => {
      let newGroups = [...groups];

      newGroups[i].done = !newGroups[i].done;

      setGroups(newGroups);
    },
    [groups]
  );

  React.useEffect(() => {
    const filteredContacts = contacts.filter(
      (contact) =>
        typeof excluded.find(
          (excludedContact) => contact === excludedContact
        ) === "undefined"
    );

    const { length } = filteredContacts;
    const groups = [];

    let gs = groupSize || 1;

    for (let i = 0; i < length; i += gs) {
      const groupContacts = filteredContacts.slice(i, i + gs);

      groups.push({
        done: false,
        contacts: groupContacts,
        key: btoa(groupContacts.join(",")),
      });
    }

    setGroups(groups);
  }, [excluded, contacts, setGroups, groupSize]);

  React.useEffect(() => {
    const todo = groups.length;
    const done = groups.reduce((totalDone, group) => group.done + totalDone, 0);

    setInfo({
      contacts: groups.reduce(
        (total, group) => group.contacts.length + total,
        0
      ),
      todo,
      done,
      remaining: todo - done,
    });
  }, [groups]);

  const onDownloadClick = React.useCallback(() => {
    const csvContent =
      "data:text/csv;charset=utf-8,EMAIL;\n" + contacts.join(";\n");
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  }, [contacts]);

  return (
    <Outer>
      <Container>
        <div className="flex flex-col space-y-6">
          <div className="flex-grow">
            <Block>
              <Block.Title className="flex justify-between">Contatti 
              
                <span 
                  className={`
                    text-xs cursor-pointer
                    ${contacts.length === 0 ? "cursor-not-allowed text-gray-300 " : "text-gray-600  hover:text-gray-900"}
                  `} 
                  onClick={onDownloadClick} 
                >
                 Scarica CSV
                </span>

              </Block.Title>
              <ContactsArea onChange={setContacts} />
              
            </Block>
          </div>
          
          <div className="border">
            <Block.Title>Escludi</Block.Title>
            <ContactsArea
              onChange={setExcluded}
              placeholder={"Inserisci qui i contatti da escludere"}
            />
          </div>
        </div>

        <Block>
          <Block.Title className="flex items-center justify-between ">
            <span>Email da inviare</span>

            <div className="flex space-x-8 items-center">
              <div>
                Separatore{" "}
                <select
                  className="ml-2"
                  selected={separator}
                  value={separator}
                  onChange={(e) => {
                    setSeparator(e.target.value);
                  }}
                >
                  {Object.entries(SEPARATORS).map(([key, value]) => (
                    <option value={key}>{value[1]}</option>
                  ))}
                </select>
              </div>

              <div>
                Contatti per gruppo
                <input
                  className="ml-2 w-24"
                  type="number"
                  onChange={(e) => setGroupSize(parseInt(e.target.value, 10))}
                  value={groupSize}
                />
              </div>
            </div>
          </Block.Title>
          {groups.map((group, i) => (
            <Group
              key={i}
              separator={separator}
              onDone={() => toggleDone(i)}
              {...group}
            />
          ))}
        </Block>
      </Container>
      <Infobar>
        {groups.length > 0 ? (
          <>
            <div>
              Hai <strong>{info.contacts}</strong> contatti, dovrai inviare{" "}
              <strong>{groups.length}</strong> email!
            </div>

            <div>
              {info.remaining === 0
                ? "Finito! 🎉"
                : `Ne manca${info.remaining > 1 ? "no" : ""} ancora ${
                    info.remaining
                  }`}
            </div>
          </>
        ) : (
          "Inserisci dei contatti per iniziare."
        )}
      </Infobar>
    </Outer>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 1rem;

  flex: 100% 1 1;
  padding: 1rem;
  padding-bottom: 24px;
`;

const Block = styled.div`
  border: 1px solid #eee;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

Block.Title = styled.div`
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  text-transform: uppercase;
  padding: 1rem;
`;

const Outer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Infobar = styled.div`
  flex: 1.5rem 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 0.5rem;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  height: 24px;
  background-color: #333;
  color: white;
  font-size: 12px;

  z-index: 100;
`;

function LocalStorage() {

  const [done, setDone] = useState()

  useEffect(() => {
    setDone(true)
  }, [setDone])

  const { groupSize, separator } = useMemo(() => {
    const {groupSize, separator} =  JSON.parse(window.localStorage.getItem('email-settings'))

    return {
      groupSize,
      separator: Number(separator)
    }
  })

  return done ? <App defaultGroupSize={groupSize} defaultSeparator={separator} /> : null

}

const rootElement = document.getElementById("root");
ReactDOM.render(<LocalStorage />, rootElement);
