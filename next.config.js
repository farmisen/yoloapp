/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js"

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.externals.push({
      canvas: "commonjs canvas"
    })
    return config
  },
  output: "standalone"
}

export default config
