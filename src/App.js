import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("catalog");

  useEffect(() => {
    // Inject the ServiceNow embeddable module handler safely in React
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import { getEmbeddables } from 'https://csmusnow.servicenowservices.com/uxasset/externals/sn_embeddable_core/index.jsdbx';
      getEmbeddables(["sn-embedx-catalog-item-form","sn-embedx-case-form"]);
    `;
    script.onload = () => {
      console.log("ServiceNow embeddable loaded");
    };

    script.onerror = () => {
      console.error("Failed to load ServiceNow embeddable");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="app">
      {/* Top Header */}
      <header className="top-header">
        <div className="logo-section">
          <span className="bank-logo">usbank.</span>
          <span className="voyager-logo">VOYAGER</span>
        </div>

        <div className="header-icons">
          <div className="icon">💬</div>
          <div className="icon">📧</div>
          <div className="icon">👤</div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="account-section">
            <div className="account-label">Selected account</div>
            <div className="account-name">RINA COBRAND 2</div>
            <div className="account-id">(850000233)</div>
          </div>

          <nav className="menu">
            <MenuItem title="Cards" />
            <MenuItem title="Drivers" />
            <MenuItem title="Vehicles" />

            <div className="divider" />

            <MenuItem title="Reports" />
            <MenuItem title="Billing" />
            <MenuItem title="Users" />
            <MenuItem title="Transactions" />
            <MenuItem title="Organization Settings" />
            <MenuItem title="Voyager+" />
            <MenuItem title="Merchants" />
            <MenuItem title="Voyager E-Invoice" />
            <MenuItem title="Authorizations" />
            <MenuItem title="API Access" />
            <MenuItem title="Support" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content">
          <h1>Hello, Balasubramanian</h1>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "catalog" ? "active" : ""}`}
              onClick={() => setActiveTab("catalog")}
            >
              <h3>Catalog Submission</h3>
            </button>
            <button
              className={`tab ${activeTab === "case" ? "active" : ""}`}
              onClick={() => setActiveTab("case")}
            >
              <h3>Case Creation</h3>
            </button>            
          </div>

          <div className="snow-container">
            {activeTab === "case" && (
              <sn-embedx-case-form
                sys-id="de45c412c312310015519f2974d3ae1b"
                confirmation-text="Case submitted successfully!"
                confirmation-sub-text="Estimated resolution in 24 hours"
                reference-number-label="Reference Number :"
                primary-button-label="View details"
                secondary-button-label="Browse services"
                prefill-fields="{}"
                custom-illustration-size="Auto"
              ></sn-embedx-case-form>
            )}

            {activeTab === "catalog" && (
              <sn-embedx-catalog-item-form
                sys-id="56c62944c30102003d3b7bfaa2d3ae36"
                confirmation-text="Request submitted successfully!"
                confirmation-sub-text="Estimated resolution in 24 hours"
                reference-number-label="Reference Number :"
                primary-button-label="View details"
                secondary-button-label="Browse services"
                prefill-fields="{}"
                custom-illustration-size="Auto"
              ></sn-embedx-catalog-item-form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuItem({ title }) {
  return (
    <div className="menu-item">
      <span>{title}</span>
      <span>›</span>
    </div>
  );
}
