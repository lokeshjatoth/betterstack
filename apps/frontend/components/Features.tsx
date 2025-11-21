import { Activity, Bell, BarChart3, Shield, Zap, Globe } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Activity,
      title: 'Uptime Monitoring',
      description: 'Monitor your websites and APIs from 30+ locations worldwide. Get instant alerts when something goes down.'
    },
    {
      icon: Bell,
      title: 'Smart Alerting',
      description: 'Receive alerts via email, SMS, Slack, and 50+ other channels. Set up on-call schedules and escalation policies.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track response times, error rates, and performance metrics. Identify bottlenecks before they impact users.'
    },
    {
      icon: Shield,
      title: 'SSL Monitoring',
      description: 'Never let your SSL certificates expire. Get automatic alerts 30 days before expiration.'
    },
    {
      icon: Zap,
      title: 'Incident Management',
      description: 'Create, track, and resolve incidents faster. Keep your team and customers informed with status pages.'
    },
    {
      icon: Globe,
      title: 'Global Infrastructure',
      description: 'Monitor from multiple continents. Detect regional outages and performance issues instantly.'
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to stay online
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive monitoring and alerting tools designed for modern development teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <feature.icon className="text-emerald-600 group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
