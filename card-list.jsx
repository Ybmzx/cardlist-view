/*
The MIT License (MIT)

Copyright © 2026 Ybmzx https://github.com/Ybmzx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function CardItemCell({ row, column }) {
  const value = dc.useMemo(() => column.value(row), [row, column.value]);
  const renderable = dc.useMemo(() => {
    if (column.render) {
      return column.render(value, row);
    }
    return value;
  }, [value, column.render, row]);
  const rendered = dc.useMemo(() => {
    if (dc.preact.isValidElement(renderable)) {
      return renderable;
    }
    return <dc.Literal value={renderable}/>;
  }, [renderable])
  return <li style={{
      overflowWrap: "break-word",
      padding: "0",
      margin: "0",
    }} className="card-list-view__card-item-cell">
      {rendered}
    </li>;
}

function CardItem({ row, columns }) {
  const cols = dc.useMemo(
    () => columns.map((column) => <CardItemCell row={row} column={column}></CardItemCell>)
  , [row, columns]);
  return <ul style={{
    listStyleType: "none",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    height: "100%",
  }} className="card-list-view__card-item">
    {cols}
  </ul>;
}

function CardList({ rows, columns, paging = undefined, scrollOnPaging = true, onPageChange = (page) => { } }) {
  if (rows.length === 0) {
    return <div></div>;
  }

  if (paging <= 0) {
    throw new Error("paging must be greater than 0");
  }

  const [current, setCurrent] = dc.useState(0);
  const containerRef = dc.useRef(null);

  const handlePageChange = dc.useCallback((page) => {
    const pageNumber = Number(page); // fuck JavaScript
    if (scrollOnPaging) {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    if (!isNaN(pageNumber)) {
      setCurrent(pageNumber);
      onPageChange(pageNumber);
    }
  }, [onPageChange]);

  const rowsWithPaging = dc.useMemo(() => {
    if (paging === undefined) {
      return rows;
    }
    return rows.slice(current * paging, (current + 1) * paging);
  }, [rows, current, paging]);

  const cardItems = dc.useMemo(() => rowsWithPaging.map((row) => {
    return <li style={{ padding: "0", margin: "0" }}>
      <CardItem row={row} columns={columns}></CardItem>
    </li>;
  }), [rowsWithPaging, columns]);

  const options = dc.useMemo(() => {
    if (paging === undefined) {
      return [];
    }
    return new Array(Math.ceil(rows.length / paging))
      .fill(0)
      .map((_, i) => ({
        value: i,
        label: `Page ${i + 1}`
      }));
  }, [rows, paging]);

  const Pageination = options.length > 1 && (
    <dc.VanillaSelect
      className="card-list-view__card-list-page-select"
      style={{ alignSelf: "flex-end" }}
      options={options}
      defaultValue={current}
      onValueChange={handlePageChange}
    />
  );

  return <>
    <style>
      {`
        .card-list-view__card-list {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }
        @media (max-width: 400pt) {
          .card-list-view__card-list {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
        }
      `}
    </style>
    <div style={{
      margin: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}
    ref={containerRef}
    className="card-list-view__card-list-container">
      <ul className="card-list-view__card-list" style={{
        listStyleType: "none",
        display: "grid",
        gap: "10px",
        padding: "0",
        margin: "0",
      }}>
        {cardItems}
      </ul>
      {Pageination}
    </div>
  </>;
}

return { CardItemCell, CardItem, CardList };
