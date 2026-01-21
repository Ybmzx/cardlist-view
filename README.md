# Cardlist View
Cardlist view for obsidian datacore plugin.

---

## Usage

```jsx
const { CardList } = await dc.require("path/to/card-list.jsx");

const COLUMNS = [
  { value: (row) => `![Cover](${row.cover})` },
  {
	  value: (row) => row.animeName,
	  render: (value, row) => dc.fileLink(value)
  }, // equivalent to "{ value: (row) => `[[${row.animeName}]]` }"
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
    <CardList
		rows={animes}
		columns={COLUMNS}
		paging={5}
		scrollOnPaging={true}
		onPageChange={(pageNumber) => console.log(pageNumber)}>
	</CardList>
  </>;
}
```

<img width="1031" height="742" alt="Clip_20260116_141505" src="https://github.com/user-attachments/assets/831c64aa-6c19-4ed5-9926-84aa4fcb7958" />


**Use [Css Snippets](https://help.obsidian.md/snippets):**

```css
.card-list-view__card-item {
  border: none !important;
  border-radius: 10px !important;
  background-color: rgb(218, 232, 238);
  box-shadow: 0 0 10px rgba(218, 232, 238, 0.3);
  transition: all 0.2s ease-in-out;
}

.card-list-view__card-item:hover {
  background-color: rgb(236, 218, 238);
  box-shadow: 0 0 8px rgba(236, 218, 238, 1);
}

.card-list-view__card-item img {
  border-radius: 10px;
}
```

<img width="1037" height="737" alt="Clip_20260116_141723" src="https://github.com/user-attachments/assets/8a35858e-82c0-43c8-a8bf-c9f24030b9a0" />

