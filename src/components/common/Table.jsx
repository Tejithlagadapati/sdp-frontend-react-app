const Table = ({ data }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Location</th>
          <th>Status</th>
          <th>Contact</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.location}</td>
            <td>
              <span className={`status ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </td>
            <td>{item.contact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;