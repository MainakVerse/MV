"use client"

import { SetStateAction, useState } from "react"
import { ChevronRight, Monitor, Settings, Shield, Target, Users, Bell, RefreshCw, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import CommandCenterPage from "../command-center/page"
import AgentNetworkPage from "../agent-network/page"
import OperationsPage from "../operations/page"
import IntelligencePage from "../intelligence/page"
import SystemsPage from "../systems/page"

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleNavClick = (sectionId: SetStateAction<string>) => {
    setActiveSection(sectionId)
    // Close mobile menu when selecting a nav item
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex h-screen">
      {/* Mobile Hamburger Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-orange-500 hover:bg-neutral-700"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 transition-transform duration-200" />
          ) : (
            <Menu className="w-5 h-5 transition-transform duration-200" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-70"
        } bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-40 h-full ${
          // Hide on mobile when collapsed, show on desktop always, show on mobile when menu is open
          sidebarCollapsed ? "md:block -translate-x-full md:translate-x-0" : "md:block"
        } ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-lg tracking-wider">TACTICAL OPS</h1>
              <p className="text-neutral-500 text-xs">v2.1.7 CLASSIFIED</p>
            </div>
            {/* Desktop collapse button - hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                  sidebarCollapsed ? "" : "rotate-180"
                }`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: Monitor, label: "COMMAND CENTER" },
              { id: "agents", icon: Users, label: "AGENT NETWORK" },
              { id: "operations", icon: Target, label: "OPERATIONS" },
              { id: "intelligence", icon: Shield, label: "INTELLIGENCE" },
              { id: "systems", icon: Settings, label: "SYSTEMS" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white transform scale-105"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800 hover:transform hover:scale-102"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6 transition-transform duration-200" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded transition-all duration-300 transform">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs text-white">SYSTEM ONLINE</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>UPTIME: 72:14:33</div>
                <div>AGENTS: 847 ACTIVE</div>
                <div>MISSIONS: 23 ONGOING</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Add padding on mobile to account for hamburger menu */}
            <div className="text-sm text-neutral-400 ml-12 md:ml-0">
              TACTICAL COMMAND / <span className="text-orange-500">OVERVIEW</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500 hidden sm:block">LAST UPDATE: 05/06/2025 20:00 UTC</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-orange-500 transition-all duration-200 hover:scale-110"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-orange-500 transition-all duration-200 hover:scale-110 hover:rotate-180"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto transition-all duration-300">
          {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "agents" && <AgentNetworkPage />}
          {activeSection === "operations" && <OperationsPage />}
          {activeSection === "intelligence" && <IntelligencePage />}
          {activeSection === "systems" && <SystemsPage />}
        </div>
      </div>
    </div>
  )
}