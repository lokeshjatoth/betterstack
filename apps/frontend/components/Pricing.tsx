import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '0',
      description: 'Perfect for side projects and small websites',
      features: [
        '10 monitors',
        '1-minute checks',
        'Email alerts',
        '30-day data retention',
        'Basic integrations',
        'Community support'
      ],
      cta: 'Start for free',
      popular: false
    },
    {
      name: 'Pro',
      price: '29',
      description: 'For growing teams that need more',
      features: [
        '50 monitors',
        '30-second checks',
        'Email, SMS & Slack alerts',
        '1-year data retention',
        'All integrations',
        'Priority support',
        'Status pages',
        'On-call schedules'
      ],
      cta: 'Start free trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with advanced needs',
      features: [
        'Unlimited monitors',
        '10-second checks',
        'All alert channels',
        'Unlimited data retention',
        'All integrations',
        'Dedicated support',
        'SLA guarantee',
        'Custom contracts',
        'SSO & SAML'
      ],
      cta: 'Contact sales',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 ${
                plan.popular
                  ? 'ring-2 ring-emerald-600 shadow-xl scale-105'
                  : 'border border-gray-200 shadow-sm'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  {plan.price === 'Custom' ? (
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </>
                  )}
                </div>
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all mb-8 ${
                  plan.popular
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
