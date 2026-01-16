function CardItemCell({ rows, column }) {
  const value = dc.useMemo(() => column.value(rows), [rows, column.value]);
  return <li style={{
      overflowWrap: "break-word",
      padding: "0",
      margin: "0",
    }}>
      <dc.Literal value={value}></dc.Literal>
    </li>;
}

function CardItem({ rows, columns }) {
  const cols = dc.useMemo(
    () => columns.map((column) => <CardItemCell rows={rows} column={column}></CardItemCell>)
  , [rows, columns]);
  return <ul style={{
    listStyleType: "none",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px"
  }}>
    {cols}
  </ul>;
}

function CardList({ rows, columns, paging = undefined, onPageChange = (page) => { } }) {
  if (rows.length === 0) {
    return <div></div>;
  }

  if (paging <= 0) {
    throw new Error("paging must be greater than 0");
  }

  const [current, setCurrent] = dc.useState(0);

  const handlePageChange = dc.useCallback((page) => {
    const pageNumber = Number(page); // fuck JavaScript
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
      <CardItem rows={row} columns={columns}></CardItem>
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
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }
        @media (max-width: 400pt) {
          .card-list-view__card-list {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
        }
      `}
    </style>
    <div style={{
      margin: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <ul className="card-list-view__card-list" style={{
        listStyleType: "none",
        display: "grid",
        gap: "10px",
        padding: "0",
        margin: "0"
      }}>
        {cardItems}
      </ul>
      {Pageination}
    </div>
  </>;
}

return { CardItemCell, CardItem, CardList };
