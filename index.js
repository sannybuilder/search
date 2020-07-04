const SEARCH_URI = "https://api.github.com/search/users";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  //   const [exactSearch, setExactSearch] = React.useState(false);
  const [selected, setSelected] = React.useState("");

  const handleSearch = (query) => {
    setIsLoading(true);
    const fuse = new Fuse(data, {
      keys: ["name"],
      includeMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true,
      threshold: 0.3,
      //   threshold: exactSearch ? 0.0 : 0.3,
    });
    const result = fuse.search(query).map((i) => ({
      name: i.item.name,
      id: i.item.id,
      np: i.item.params.length,
      indices: i.matches[0].indices,
    }));
    setOptions(result);
    setIsLoading(false);
  };

  //   const handleChange = (event) => {
  //     setExactSearch(event.target.checked);
  //   };

  const handleClick = (items) => {
    const op = items[0];
    setSelected(op);
  };

  const typeAhead = React.createElement(
    ReactBootstrapTypeahead.AsyncTypeahead,
    {
      id: "opcode-search",
      isLoading: isLoading,
      labelKey: "name",
      minLength: 2,
      onSearch: handleSearch,
      onChange: handleClick,
      options: options,
      placeholder: "Start typing, e.g. WAIT...",
      useCache: false,
      autoFocus: true,
      filterBy: () => true, // filtering is done by fuse.js
      renderMenuItemChildren: (option, props) =>
        React.createElement(
          React.Fragment,
          null,
          ...highlight(option.name, option.indices)
        ),
    }
  );

  //   const cb = React.createElement("input", {
  //     type: "checkbox",
  //     value: exactSearch,
  //     onChange: handleChange,
  //     style: { marginRight: "4px" },
  //   });

  //   const label = React.createElement("label", null, cb, "Exact search");

  const copyToClipboard = React.createElement(
    CopyToClipboard,
    {
      text: selected?.name,
    },
    React.createElement("div", {
      title: "Copy to Clipboard",
      style: {
        width: "24px",
        height: "24px",
        cursor: "pointer",
        marginLeft: "8px",
        background:
          "url('https://img.icons8.com/material-rounded/24/000000/copy.png') no-repeat",
      },
    })
  );

  return React.createElement(
    "div",
    {
      style: {
        width: "600px",
        margin: "0 auto",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          margin: "25vh auto 8px",
          display: "flex",
          alignItems: "center",
        },
      },
      typeAhead,
      copyToClipboard
    ),
    // label,
    React.createElement(
      "a",
      {
        className: "text-muted",
        target: "_blank",
        href: "https://fusejs.io/examples.html#extended-search",
        style: { fontSize: "80%" },
      },
      "Advanced Search Syntax"
    ),
    React.createElement(
      "div",
      { style: { marginTop: "24px" } },
      getDescription(selected)
    )
  );
};

function highlight(text, indices) {
  const elems = [];
  let nextSpan = -1;
  for (let i = 0; i < indices.length; i++) {
    const nextB = indices[i][0];
    const span = React.createElement(
      React.Fragment,
      null,
      text.substring(nextSpan + 1, nextB)
    );
    nextSpan = indices[i][1];
    const b = React.createElement(
      "b",
      null,
      text.substring(nextB, nextSpan + 1)
    );
    elems.push(span, b);
  }

  elems.push(React.createElement("span", null, text.substring(nextSpan + 1)));
  return elems;
}

function getDescription(op) {
  if (!op) return "";
  return React.createElement("span", null, [
    `id: ${op.id}, params: ${op.np}`,
    React.createElement("br", {
      key: "br1",
    }),
    React.createElement(
      "a",
      {
        key: "a1",
        href: `https://gtamods.com/wiki/${op.id}`,
        target: "_blank",
      },
      "Description at GTAMods.com"
    ),
    React.createElement("br", {
      key: "br2",
    }),
    React.createElement(
      "a",
      {
        key: "a2",
        href: `https://gtagmodding.com/opcode-database/opcode/${op.id}/`,
        target: "_blank",
      },
      "Description at GTAGModding.com"
    ),
  ]);
}

let data;

fetch(`./gtasa.json`)
  .then((resp) => resp.json())
  .then((items) => {
    data = items;

    const app = React.createElement(App, null);

    ReactDOM.render(app, document.getElementById("app"));
  });
