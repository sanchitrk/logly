import { PageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: PageProps) {
  return <p>404 not found: {url.pathname}</p>;
}
