import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaLaptopCode, FaGlobe, FaMobileAlt, FaPalette, FaCloud, FaRobot, FaArrowRight, FaRocket } from 'react-icons/fa';

const Service = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Custom Software',
      description: 'Tailored enterprise solutions designed specifically to meet your unique business requirements and scale seamlessly.',
      icon: <FaLaptopCode style={{ color: '#FF6900' }} />,
      color: '#FF6900'
    },
    {
      title: 'Web Applications',
      description: 'High-performance React & modern framework web applications engineered for speed, SEO, and conversion.',
      icon: <FaGlobe style={{ color: '#193CB8' }} />,
      color: '#193CB8'
    },
    {
      title: 'Mobile App Development',
      description: 'Cross-platform native-feeling mobile applications built for iOS and Android with smooth 60fps performance.',
      icon: <FaMobileAlt style={{ color: '#FF6900' }} />,
      color: '#FF6900'
    },
    {
      title: 'UI/UX Design Systems',
      description: 'Intuitive user interface design systems, interactive prototypes, and conversion rate optimized user journeys.',
      icon: <FaPalette style={{ color: '#193CB8' }} />,
      color: '#193CB8'
    },
    {
      title: 'Cloud Solutions & DevOps',
      description: 'Secure, scalable cloud infrastructure deployment, continuous delivery pipelines, and 99.9% uptime monitoring.',
      icon: <FaCloud style={{ color: '#FF6900' }} />,
      color: '#FF6900'
    },
    {
      title: 'AI & Machine Learning',
      description: 'Intelligent automation, predictive analytics, custom LLM integrations, and workflow automation.',
      icon: <FaRobot style={{ color: '#193CB8' }} />,
      color: '#193CB8'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.96 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 16
      }
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)',
        color: '#0f172a',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        padding: '4rem 2rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Light Glow Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '-150px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 105, 0, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25, 60, 184, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '50px',
              background: 'rgba(255, 105, 0, 0.08)',
              border: '1px solid rgba(255, 105, 0, 0.25)',
              color: '#FF6900',
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}
          >
            Digital Services
          </span>
          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: '800',
              lineHeight: '1.2',
              margin: '0 0 1rem 0',
              color: '#193CB8'
            }}
          >
            Transform Your Business With <span style={{ color: '#FF6900' }}>Our Solutions</span>
          </h1>
          <p
            style={{
              color: '#475569',
              fontSize: '1.2rem',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            End-to-end engineering, custom software development, and digital marketing systems built for scale and growth.
          </p>
        </motion.div>

        {/* Services Grid (Light Theme Cards) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(25, 60, 184, 0.12)',
                borderRadius: '20px',
                padding: '2.2rem',
                boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: service.color === '#FF6900'
                    ? 'linear-gradient(90deg, #FF6900, #193CB8)'
                    : 'linear-gradient(90deg, #193CB8, #FF6900)'
                }}
              />

              <div>
                {/* Icon Circle */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: service.color === '#FF6900' ? 'rgba(255, 105, 0, 0.08)' : 'rgba(25, 60, 184, 0.08)',
                    border: `1px solid ${service.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  {service.icon}
                </div>

                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '0.8rem'
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    color: '#475569',
                    fontSize: '0.98rem',
                    lineHeight: '1.6',
                    marginBottom: '1.8rem'
                  }}
                >
                  {service.description}
                </p>
              </div>

              <div
                onClick={() => navigate('/contact')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: service.color,
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: 'auto'
                }}
              >
                <span>Inquire About This Service</span>
                <FaArrowRight style={{ fontSize: '0.85rem' }} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner Section (Light Theme) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(25, 60, 184, 0.15)',
            borderRadius: '24px',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(25, 60, 184, 0.1)'
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '750px',
              margin: '0 auto'
            }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#193CB8',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}
            >
              Ready to <span style={{ color: '#FF6900' }}>Elevate</span> Your Digital Presence?
            </h2>
            <p
              style={{
                color: '#475569',
                fontSize: '1.1rem',
                marginBottom: '2.2rem',
                lineHeight: '1.6'
              }}
            >
              Let's collaborate to build software solutions that yield higher conversion rates and exponential growth.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.2rem',
                flexWrap: 'wrap'
              }}
            >
              <button
                onClick={() => navigate('/contact')}
                style={{
                  padding: '16px 32px',
                  background: '#FF6900',
                  color: '#ffffff',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(255, 105, 0, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaRocket /> Start Your Project
              </button>
              <button
                onClick={() => navigate('/contact')}
                style={{
                  padding: '16px 32px',
                  background: '#ffffff',
                  color: '#193CB8',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: '1px solid rgba(25, 60, 184, 0.25)',
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(25, 60, 184, 0.08)'
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Service;