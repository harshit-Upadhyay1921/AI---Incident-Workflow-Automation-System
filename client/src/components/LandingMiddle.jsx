import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const LandingMiddle = () => {
  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 py-16 space-y-24">

      {/* INTRO SECTION */}
      <section className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-primary"
        >
          IncidentIQ
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-700 font-medium"
        >
          Intelligent IT Service Management for Modern Enterprises
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl mx-auto text-gray-600 leading-relaxed"
        >
          IncidentIQ automates the end-to-end lifecycle of IT incidents to
          deliver faster, smarter, and more reliable support. Built for
          efficiency and precision, IncidentIQ unifies AI-driven insights,
          automated workflows, and real-time escalations to ensure every
          employee issue is resolved with minimal effort.
        </motion.p>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center pt-6"
        >
          <img
            src="/your-illustration.png"
            alt="IncidentIQ Illustration"
            className="w-full max-w-xl rounded-2xl border border-gray-200 shadow-sm"
          />
        </motion.div>
      </section>

      {/* FEATURE CARDS */}
      <section className="space-y-10">
        <h2 className="text-3xl sm:text-4xl font-semibold text-primary">
          Key Capabilities
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Automated Classification",
              text: "Immediate detection of priority, status, and category the moment an incident is created."
            },
            {
              title: "Smart Auto-Assignment",
              text: "Routes each incident to the right resolver group or technician without manual steps."
            },
            {
              title: "Intelligent Escalations",
              text: "Auto-escalates unresolved issues based on due times & SLA conditions."
            },
            {
              title: "AI-Driven Workflows",
              text: "Enhances IT efficiency with predictive, automated responses and orchestration."
            },
            {
              title: "Webhook Integrations",
              text: "Real-time triggers that update external systems instantly when escalations occur."
            },
            {
              title: "End-to-End Lifecycle Automation",
              text: "Streamlines the entire incident flow from creation to resolution."
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-default bg-white"
            >
              <h3 className="text-xl font-semibold text-primary mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-semibold text-primary"
        >
          How does IncidentIQ work?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-4xl text-gray-600 leading-relaxed"
        >
          With automated classification of priority, status, and category at the 
          moment an incident is created, IncidentIQ eliminates manual 
          decision-making and sets accurate due times, next-escalation windows, 
          and assignments instantly. Smart auto-assignment ensures each ticket 
          reaches the right resolver group or technician without delay, while 
          intelligent escalation triggers ensure unresolved issues never fall 
          through the cracks. Realtime webhook notifications power seamless 
          integrations—keeping teams, tools, and systems updated the moment an 
          escalation occurs.
        </motion.p>
      </section>

      {/* BENEFITS */}
      <section className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-semibold text-primary"
        >
          Benefits of IncidentIQ
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-4xl text-gray-600 leading-relaxed"
        >
          Deliver consistent, predictive, and effortless IT service experiences 
          with IncidentIQ—the smarter way to manage incidents across your 
          organization.
        </motion.p>
      </section>

      {/* CTA SECTION */}
      <section className="text-center py-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-block"
        >
          <button
            className="px-10 py-4 text-lg font-semibold rounded-xl bg-primary text-white hover:bg-[#053B2C] transition shadow-md"
          >
            Get Started
          </button>
        </motion.div>
      </section>

    </div>
  );
};

export default LandingMiddle;
