const Home = () => {
  return (
    <div className="main-container">
      <div className="stats-container">
        <div className="stats-header">
          <div className="stats-title">ÚLTIMA CARRERA</div>
          <div className="stats-title">MEJORES</div>
        </div>
        
        <div className="stats-table-container">
          <table className="stats-table">
            <thead>
              <tr>
                <th>TOP</th>
                <th>Nombre</th>
                <th>Tiempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">1</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td className="font-semibold">2</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td className="font-semibold">3</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;