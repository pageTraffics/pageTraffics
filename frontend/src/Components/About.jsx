import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaRocket, 
  FaChartLine, 
  FaShieldAlt, 
  FaUsers, 
  FaCheckCircle, 
  FaLightbulb, 
  FaCogs, 
  FaArrowRight, 
  FaAward,
  FaLaptopCode,
  FaHandshake
} from 'react-icons/fa';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '150+', label: 'Projects Delivered' },
    { number: '95%', label: 'Client Retention' },
    { number: '10+', label: 'Years Experience' },
    { number: '99.8%', label: 'On-Time Delivery' }
  ];

  const pillars = [
    {
      title: 'Engineering Excellence',
      desc: 'We build robust, scalable architectures using modern React, Node, and cloud technology stacks.',
      icon: <FaLaptopCode style={{ color: '#FF6900' }} />
    },
    {
      title: 'Data-Driven Growth',
      desc: 'Every UI element and marketing strategy is optimized to maximize conversion rates and revenue.',
      icon: <FaChartLine style={{ color: '#193CB8' }} />
    },
    {
      title: 'Transparent Partnership',
      desc: 'No hidden fees or surprises. We operate as an aligned extension of your internal product team.',
      icon: <FaHandshake style={{ color: '#FF6900' }} />
    },
    {
      title: 'Enterprise Security',
      desc: 'Strict compliance, secure code standards, and 99.9% cloud infrastructure reliability.',
      icon: <FaShieldAlt style={{ color: '#193CB8' }} />
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Strategy',
      desc: 'We map out your business goals, target audience, technical roadmap, and architectural blueprint.',
      color: '#FF6900'
    },
    {
      step: '02',
      title: 'Agile Development',
      desc: 'Iterative sprint releases with clean code standards, constant communication, and peer code reviews.',
      color: '#193CB8'
    },
    {
      step: '03',
      title: 'Rigorous QA & Testing',
      desc: 'Comprehensive automated and manual testing for speed, security, responsiveness, and cross-browser support.',
      color: '#FF6900'
    },
    {
      step: '04',
      title: 'Launch & Continuous Scale',
      desc: 'Smooth production deployment followed by performance monitoring, analytics tracking, and scaling.',
      color: '#193CB8'
    }
  ];

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
      {/* Decorative Light Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 105, 0, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          right: '-150px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25, 60, 184, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '50px',
              background: 'rgba(255, 105, 0, 0.08)',
              border: '1px solid rgba(255, 105, 0, 0.25)',
              color: '#FF6900',
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '1.2rem'
            }}
          >
            About Page Traffics
          </span>
          <h1
            style={{
              fontSize: '3.3rem',
              fontWeight: '800',
              lineHeight: '1.25',
              color: '#193CB8',
              maxWidth: '900px',
              margin: '0 auto 1.2rem auto'
            }}
          >
            Engineering High-Performance Digital Products That <span style={{ color: '#FF6900' }}>Scale Businesses</span>
          </h1>
          <p
            style={{
              color: '#475569',
              fontSize: '1.2rem',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            PageTraffics is an end-to-end software development and digital growth agency dedicated to turning complex ideas into seamless, high-converting digital realities.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '5rem'
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(25, 60, 184, 0.12)',
                borderRadius: '20px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)'
              }}
            >
              <div
                style={{
                  fontSize: '2.8rem',
                  fontWeight: '800',
                  color: '#FF6900',
                  marginBottom: '0.4rem'
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  color: '#475569',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mission & Story Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(25, 60, 184, 0.12)',
            borderRadius: '24px',
            padding: '3.5rem 3rem',
            marginBottom: '5rem',
            boxShadow: '0 10px 35px rgba(25, 60, 184, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                color: '#FF6900',
                fontWeight: '700',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.6rem'
              }}
            >
              Our Mission
            </span>
            <h2
              style={{
                fontSize: '2.2rem',
                fontWeight: '800',
                color: '#193CB8',
                marginBottom: '1.2rem',
                lineHeight: '1.3'
              }}
            >
              Bridging Technical Innovation & Commercial Success
            </h2>
            <p
              style={{
                color: '#475569',
                fontSize: '1.05rem',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}
            >
              Founded with the vision to eliminate inefficient software development and fragmented marketing, PageTraffics delivers unified digital solutions. We combine world-class UI design with robust full-stack engineering to build products that users love and businesses thrive on.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                'Full-Stack Custom Web & Mobile Development',
                'Conversion-Focused UI/UX Design Systems',
                'Enterprise Cloud Infrastructure & 99.9% Uptime',
                'Dedicated Support & Continuous Optimization'
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', fontWeight: '600' }}>
                  <FaCheckCircle style={{ color: '#FF6900', fontSize: '1.1rem', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(25, 60, 184, 0.12)',
              border: '1px solid rgba(25, 60, 184, 0.15)',
              minHeight: '320px',
              height: '100%',
              maxHeight: '400px'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="PageTraffics Team Collaborating"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </motion.div>

        {/* Core Pillars / Values Section */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                color: '#FF6900',
                fontWeight: '700',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              Why We Excel
            </span>
            <h2
              style={{
                fontSize: '2.4rem',
                fontWeight: '800',
                color: '#193CB8',
                marginTop: '0.4rem'
              }}
            >
              Our Core Principles
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem'
            }}
          >
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(25, 60, 184, 0.12)',
                  borderRadius: '20px',
                  padding: '2.2rem',
                  boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'rgba(25, 60, 184, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '1.2rem'
                  }}
                >
                  {pillar.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#193CB8',
                    marginBottom: '0.6rem'
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Development Methodology Process */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid rgba(25, 60, 184, 0.12)',
            borderRadius: '24px',
            padding: '4rem 2.5rem',
            marginBottom: '5rem',
            boxShadow: '0 10px 35px rgba(25, 60, 184, 0.08)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span
              style={{
                color: '#FF6900',
                fontWeight: '700',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              How We Work
            </span>
            <h2
              style={{
                fontSize: '2.4rem',
                fontWeight: '800',
                color: '#193CB8',
                marginTop: '0.4rem'
              }}
            >
              Our 4-Step Engineering Process
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem'
            }}
          >
            {processSteps.map((stepItem, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid rgba(25, 60, 184, 0.1)',
                  borderRadius: '18px',
                  padding: '2rem 1.6rem',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: stepItem.color,
                    marginBottom: '0.8rem'
                  }}
                >
                  {stepItem.step}
                </div>
                <h4
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#193CB8',
                    marginBottom: '0.6rem'
                  }}
                >
                  {stepItem.title}
                </h4>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                  {stepItem.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid rgba(25, 60, 184, 0.15)',
            borderRadius: '24px',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(25, 60, 184, 0.1)'
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#193CB8',
              marginBottom: '1rem'
            }}
          >
            Ready to Build Your Next <span style={{ color: '#FF6900' }}>Success Story</span>?
          </h2>
          <p
            style={{
              color: '#475569',
              fontSize: '1.15rem',
              maxWidth: '650px',
              margin: '0 auto 2.2rem auto',
              lineHeight: '1.6'
            }}
          >
            Let's discuss your project goals, technical requirements, and growth strategy today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
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
              <FaRocket /> Start a Conversation
            </button>
            <button
              onClick={() => navigate('/services')}
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
              View Our Services
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;