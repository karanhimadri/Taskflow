import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/UserContext';

const ModernLandingPage = () => {
  const { user } = useAuth();
  
  // State for the Role/Tab selection
  const [activeRole, setActiveRole] = React.useState<'admin' | 'manager' | 'member'>('admin'); 
  
  const roleData = {
    admin: {
      tag: 'ADMINISTRATOR',
      color: 'blue',
      title: 'User & Access Management',
      description: 'Oversee the entire organization by registering users, assigning roles, and maintaining system-wide control.',
      features: ['Register managers and members', 'Assign user roles and permissions', 'Maintain organizational structure', "Monitor system activity"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.562.344 1.25.508 1.948.508z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    manager: {
      tag: 'MANAGER',
      color: 'indigo',
      title: 'Project & Task Orchestration',
      description: 'Create and manage projects, build teams, assign tasks, and track progress with comprehensive analytics.',
      features: ['Create and manage projects', 'Add members to project teams', 'Create and assign tasks with priorities', 'Track project statistics and team progress'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    member: {
      tag: 'MEMBER',
      color: 'sky',
      title: 'Task Execution & Updates',
      description: 'Focus on your assigned tasks, update progress in real-time, and contribute to project success.',
      features: ['View all assigned tasks', 'Update task status (TODO, IN_PROGRESS, DONE)', 'Track personal task progress', 'Manage task priorities and deadlines'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  };
  
  const currentRole = roleData[activeRole];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      
      {/* 1. HERO SECTION: Jira-inspired Blue Theme */}
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-20 pb-32">
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              
              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                Move fast, stay aligned, and
                <br />
                <span className="text-blue-200">
                  build better, together
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
                TaskFlow brings teams together to plan, track, and deliver world-class work with confidence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                {/* Primary CTA: White on Blue */}
                <Link
                  to={user ? "/dashboard" : "/auth"}
                  className="px-8 py-4 bg-white text-blue-600 rounded-md font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  {user ? "Go to your work" : "Get started"}
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Hero Image Placeholder */}
              <div className="mt-16 relative">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-5xl mx-auto border-4 border-blue-200">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg h-96 flex items-center justify-center">
                    {/* Mock Dashboard Preview */}
                    <div className="w-full h-full p-6 space-y-4">
                      {/* Header Bar */}
                      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">T</div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-20 h-8 bg-blue-100 rounded"></div>
                          <div className="w-20 h-8 bg-blue-600 rounded"></div>
                        </div>
                      </div>
                      
                      {/* Task Cards Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <div className="bg-gray-100 rounded px-3 py-2 text-sm font-semibold text-gray-600">TO DO</div>
                          <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                            <div className="flex items-center gap-2 mt-3">
                              <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                              <div className="w-12 h-4 bg-blue-100 rounded-full"></div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-blue-100 rounded px-3 py-2 text-sm font-semibold text-blue-700">IN PROGRESS</div>
                          <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                            <div className="flex items-center gap-2 mt-3">
                              <div className="w-6 h-6 bg-indigo-200 rounded-full"></div>
                              <div className="w-12 h-4 bg-indigo-100 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-green-100 rounded px-3 py-2 text-sm font-semibold text-green-700">DONE</div>
                          <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURES SECTION: Clean White Background */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Built for every team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                TaskFlow adapts to any project and scales with your organization
              </p>
            </div>

            {/* Feature 1: Project Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="lg:order-1">
                <div className="inline-block p-3 bg-blue-100 rounded-lg mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart Project Management</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Create and organize projects with ease. Managers can build teams, assign members, and maintain a clear overview of all project activities in a centralized dashboard.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Create unlimited projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Build and manage teams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Real-time collaboration</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-gray-900">Website Redesign</div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">ACTIVE</div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">8 members • 24 tasks</div>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-gray-900">Mobile App Launch</div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">ON TRACK</div>
                      </div>
                      <div className="text-sm text-gray-600">12 members • 45 tasks</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Task Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="lg:order-2">
                <div className="inline-block p-3 bg-indigo-100 rounded-lg mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Advanced Task Tracking</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Track tasks with precision using status indicators (TODO, IN_PROGRESS, DONE), priority levels, and due dates. Members get instant visibility into their assignments.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Custom workflows and statuses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Priority and deadline management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Real-time progress updates</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-1">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 shadow-lg">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-5 shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">Design new homepage</div>
                          <div className="text-sm text-gray-500">Due: Oct 20, 2025</div>
                        </div>
                        <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">HIGH</div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
                        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">IN PROGRESS</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">Update API documentation</div>
                          <div className="text-sm text-gray-500">Due: Oct 18, 2025</div>
                        </div>
                        <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">MEDIUM</div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">SK</div>
                        <div className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">TODO</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-md opacity-75">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1 line-through">Setup CI/CD pipeline</div>
                          <div className="text-sm text-gray-500">Completed: Oct 15, 2025</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">AM</div>
                        <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">DONE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ROLES SECTION: Light Gray Background */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Powerful for admins. Simple for everyone.
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Role-based access ensures every team member has the right tools and permissions.
              </p>
            </div>

            {/* Role Tabs */}
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center mb-12 space-x-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                {(Object.keys(roleData) as Array<keyof typeof roleData>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveRole(key)}
                    className={`
                      px-8 py-3 rounded-md font-semibold text-base transition-all duration-200 flex-1
                      ${activeRole === key 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    {roleData[key].tag}
                  </button>
                ))}
              </div>

              {/* Role Content Display */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-10 md:p-12">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`bg-${currentRole.color}-100 p-3 rounded-xl shadow-sm`}>
                      {currentRole.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{currentRole.title}</h3>
                  </div>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed">{currentRole.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentRole.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. STATS SECTION */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl font-bold text-white mb-3">3</div>
                <div className="text-xl text-blue-100">User Roles</div>
                <p className="text-blue-200 mt-2">Admin, Manager, Member</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-3">Real-Time</div>
                <div className="text-xl text-blue-100">Task Updates</div>
                <p className="text-blue-200 mt-2">Instant collaboration</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-3">Secure</div>
                <div className="text-xl text-blue-100">Access Control</div>
                <p className="text-blue-200 mt-2">Role-based permissions</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FINAL CTA SECTION */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of teams who plan, track, and release great software with TaskFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/auth"}
                className="px-10 py-4 bg-blue-600 text-white rounded-md font-semibold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
              >
                {user ? "Go to your work" : "Get started for free"}
              </Link>
              <Link
                to="/auth"
                className="px-10 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-md font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                View demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ModernLandingPage;
