export default function Stats() {
  const stats = [
    { value: '99.99%', label: 'Uptime guarantee' },
    { value: '150+', label: 'Integrations' },
    { value: '<30s', label: 'Alert latency' },
    { value: '50k+', label: 'Companies trust us' }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
