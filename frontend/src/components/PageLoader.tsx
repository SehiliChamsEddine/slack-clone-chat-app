import { Loader } from 'lucide-react';
const PageLoader = () => {
	return (
		<div className="min-h-screen bg-gray-800 flex items-center justify-center">
			<Loader className="animate-spin text-white " width={50} height={50} />
		</div>
	);
};

export default PageLoader;
