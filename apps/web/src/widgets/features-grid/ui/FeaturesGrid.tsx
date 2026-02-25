/**
 * @file apps/web/src/widgets/features-grid/ui/FeaturesGrid.tsx
 * @summary Features grid component.
 * @description Grid of feature cards showcasing platform capabilities.
 */

export function FeaturesGrid() {
  const features = [
    {
      title: "Multi-tenant Architecture",
      description: "Scale to 1000+ clients with isolated configurations and secure data separation.",
      icon: "🏢"
    },
    {
      title: "Lead Capture & Management",
      description: "Capture leads with custom forms and manage them in an intuitive dashboard.",
      icon: "📝"
    },
    {
      title: "SEO Optimization",
      description: "Built-in SEO tools to improve your search rankings and drive organic traffic.",
      icon: "🔍"
    },
    {
      title: "Performance Monitoring",
      description: "Real-time analytics and performance insights to optimize your marketing efforts.",
      icon: "📊"
    },
    {
      title: "Custom Templates",
      description: "Choose from dozens of professionally designed templates or create your own.",
      icon: "🎨"
    },
    {
      title: "Analytics & Reporting",
      description: "Comprehensive reporting to track conversions, traffic, and user behavior.",
      icon: "📈"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools and features you need to create, manage, 
            and optimize high-performing marketing websites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
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
  )
}
