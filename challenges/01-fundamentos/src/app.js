import { extractQueryParams } from "./utils/extract-query-params.js";
import { json } from "./middlewares/json.js";
import { routes } from "./routes/routes.js";

export async function app(request, response) {
  const { method, url } = request;

  console.log(`\nNova requisição\n-Método: ${method}\n-Rota:   ${url}`);

  await json(request, response);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  // tratamento da request/response antes de chamar o handler das rotas
  if (route) {
    const routeParams = request.url.match(route.path);
    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    return route.handler(request, response);
  }

  return response.writeHead(404).end();
}
