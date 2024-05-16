/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
	    ignoreDuringBuilds: true,
		typescript: {
			ignoreBuildErrors: true
		}
	
		
	  },
	  typescript: {
		ignoreBuildErrors: true
	},
	 webpack: (config) => {
		  config.resolve.alias.canvas = false;
		
		   return config;
		},
};

export default nextConfig;
