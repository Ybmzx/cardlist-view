# Cardlist View
Cardlist view for obsidian datacore plugin.

---

## Usage

```jsx
const { CardList } = await dc.require("path/to/card-list.jsx")

const COLUMNS = [
  { value: (row) => `![Cover](${row.cover})` },
  { value: (row) => `[[${row.animeName}]]` },
  { value: (row) => `**${row.state}**` },
  { value: (row) => `Watched: **${row.watchedEpisode}**` },
  { value: (row) => `**${row.rating ?? '-'}**⭐` },
  { value: (row) => row.lastProgressUpdate.toLocaleString() },
];

return function View() {
  const animes = [
    { cover: "...", animeName: "...", state: "...", ... },
    ...
  ];

  // paging - the number of items per page, undefined for no paging
  return <>
    <h1>Animes</h1>
    <CardList rows={animes} columns={COLUMNS} paging={5} onPageChange={(pageNumber) => console.log(pageNumber)}></CardList>
  </>;
}
```

<img width="1197" height="772" alt="image" src="https://github.com/user-attachments/assets/48f913a1-b8fe-46da-b380-241819ee7603" />

