import { NextRouter } from "next/router";

export function clearCache(router: NextRouter) {
  localStorage.clear();

  router.push("/");
}
