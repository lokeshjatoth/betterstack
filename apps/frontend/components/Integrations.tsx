export default function Integrations() {
  const integrations = [
    'Slack',
    'PagerDuty',
    'Discord',
    'Microsoft Teams',
    'Datadog',
    'Grafana',
    'New Relic',
    'Splunk',
    'Jira',
    'GitHub',
    'GitLab',
    'Stripe'
  ];

  return (
    <section id="integrations" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Integrates with your entire stack
          </h2>
          <p className="text-xl text-gray-600">
            Connect with the tools you already use. No complex setup required.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200 hover:border-emerald-300 cursor-pointer group"
            >
              <span className="text-gray-700 font-semibold text-lg group-hover:text-emerald-600 transition-colors">
                {integration}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg">
            View all 150+ integrations →
          </button>
        </div>
      </div>
    </section>
  );
}
