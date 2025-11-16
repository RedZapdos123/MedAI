export default function CrisisBanner({ resources, text }) {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 shadow-lg mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-3xl mr-4">🚨</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Immediate Help Available</h2>
          <p className="mb-4">{text}</p>
          
          <div className="space-y-2">
            {resources.map((resource, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-3">
                <a
                  href={resource.url}
                  className="font-medium hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="mr-2">📞</span>
                  <span>{resource.name}</span>
                </a>
                {resource.text && <p className="text-sm mt-1 ml-6">{resource.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
