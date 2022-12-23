const faunadb = require('faunadb');

exports.handler = async (event, context) => {
  // Parse the lat and long values from the request body
  const body = JSON.parse(event.body);
  const lat = body.lat;
  const lng = body.lng;

  // Create a FaunaDB client
  const client = new faunadb.Client({ secret: process.env.DB_SECRT });

  // Try to find a matching record in the locations_by_latlong index
  try {
    const result = await client.query(
      faunadb.query.Get(
        faunadb.query.Match(faunadb.query.Index('locations_by_latlong'), [lat, lng])
      )
    );

    // Return the image and text fields from the matching record
    return {
      statusCode: 200,
      body: JSON.stringify({
        image: result.data.image,
        text: result.data.text
      })
    };
  } catch (error) {
    // Return a message if no matching record was found
    return {
      statusCode: 404,
      body: 'nothing here'
    };
  }
};
