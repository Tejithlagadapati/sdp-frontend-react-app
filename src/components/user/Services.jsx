import Card from "../common/Card";

const Services = () => {
  return (
    <>
      <h2>City Services</h2>
      <p className="muted">
        Explore important public services
      </p>

      <div className="service-grid">

        <Card>
          <h3>🏥 Healthcare</h3>
          <p>Hospitals, clinics, ambulance services</p>
          <p>📞 108 / 104</p>
        </Card>

        <Card>
          <h3>🚌 Public Transport</h3>
          <p>Buses, metro, routes, timings</p>
          <p>📞 1800-123-456</p>
        </Card>

        <Card>
          <h3>🚓 Emergency</h3>
          <p>Police, fire, disaster response</p>
          <p>📞 112</p>
        </Card>

        <Card>
          <h3>🏝 Tourism</h3>
          <p>Parks, monuments, guides</p>
          <p>📞 1800-555-999</p>
        </Card>

      </div>
    </>
  );
};

export default Services;