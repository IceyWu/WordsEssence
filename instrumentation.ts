/**
 * Server startup hook. Runs once before the server handles requests.
 *
 * Why: some hosts (e.g. a BaoTa/宝塔 box without working IPv6 routing) resolve
 * dual-stack upstreams like Cloudflare to an AAAA record first. Node's fetch
 * (undici) then tries IPv6, fails with "Network is unreachable", and surfaces
 * a generic `fetch failed` — even though IPv4 works fine. Forcing IPv4-first
 * DNS ordering makes outbound calls (Essays API, OCR API) reliable everywhere.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    // Prefer IPv4 addresses when a host has both A and AAAA records.
    dns.setDefaultResultOrder("ipv4first");
  }
}
