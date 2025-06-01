import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import PatientView from "./PatientView"
import DoctorView from "./DoctorView"

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("overview")

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} activeView={activeView} onViewChange={setActiveView} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <main className="flex-1 overflow-y-auto p-6">
          {user.type === "patient" ? (
            <PatientView user={user} activeView={activeView} />
          ) : (
            <DoctorView user={user} activeView={activeView} />
          )}
        </main>
      </div>
    </div>
  )
}

