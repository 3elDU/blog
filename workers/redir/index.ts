export default {
  async fetch(req: Request): Promise<Response> {
    const path = new URL(req.url).pathname;

    return new Response(null, {
      status: 301, // moved permanently,
      headers: {
        Location: new URL(path, "https://petafloppa.cc").toString(),
      },
    });
  },
};
