import React, { useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const catalogItemRef = useRef(null);

  // 1. INITIALIZATION EFFECT: Loads the ServiceNow Core Engine once
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import { getEmbeddables } from 'https://csmusdev.servicenowservices.com/uxasset/externals/sn_embeddable_core/index.jsdbx';
      // Load only your customized voyager component
      getEmbeddables(["sn-custom-embedx-voyager-catalog-item"]);
    `;
    
    script.onload = () => console.log("ServiceNow embeddable loaded");
    script.onerror = () => console.error("Failed to load ServiceNow embeddable");
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 2. EVENT LISTENER EFFECT: Safely binds events to the component when it mounts
  useEffect(() => {
    const component = catalogItemRef.current;
    
    if (!component) return;

    // Define standard event handlers
    const handleRecordCreated = (e) => {
      const { table, record_sys_id } = e.detail.payload;
      console.log("Record created:", table, record_sys_id);
    };

    const handleButtonClicked = (e) => {
      const { table, record_sys_id, button_variant } = e.detail.payload;
      const primaryURL = '/caseview'; 
      const secondaryURL = '/browse'; 

      if (button_variant === 'primary') {
        const caseViewURL = `${primaryURL}?emb_table=${table}&emb_recordid=${record_sys_id}`;
        window.open(caseViewURL, '_self'); 
      } else {
        window.open(secondaryURL, '_self');
      }
    };

    const handleError = (e) => {
      const { errorMessage, errorType } = e.detail.payload;
      console.error("Component Error:", errorMessage, errorType);
    };

    // --- NEW HANDLER FOR DOWNLOAD ---
    const handleDownloadClicked = (e) => {
      const { downloadUrl } = e.detail.payload;
      
      if (downloadUrl) {
        // Prepend your specific ServiceNow instance URL to handle cross-origin downloads correctly
        const instanceUrl = 'https://csmusdev.servicenowservices.com';
        const fullDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `${instanceUrl}${downloadUrl}`;
        
        // Open the download in a new tab securely
        window.open(fullDownloadUrl, '_blank');
      }
    };

    // Attach native Web Component event listeners
    component.addEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#RECORD_CREATION_SUCCEEDED', handleRecordCreated);
    component.addEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#BUTTON_CLICKED', handleButtonClicked);
    component.addEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#COMPONENT_ERROR', handleError);
    component.addEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#DOWNLOAD_CLICKED', handleDownloadClicked);

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      component.removeEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#RECORD_CREATION_SUCCEEDED', handleRecordCreated);
      component.removeEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#BUTTON_CLICKED', handleButtonClicked);
      component.removeEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#COMPONENT_ERROR', handleError);
      component.removeEventListener('SN_EMBEDX_CATALOG_ITEM_FORM#DOWNLOAD_CLICKED', handleDownloadClicked);
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
            <MenuItem title="Support" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content">
          <h1>Hello, Balasubramanian</h1>
          
          <br />

          <div className="snow-container">
            <sn-custom-embedx-voyager-catalog-item
              ref={catalogItemRef}
              sys-id="3c9609e31b768b50a79f5538624bcb5a"
              confirmation-text="Request submitted successfully!"
              confirmation-sub-text="Estimated resolution in 24 hours"
              reference-number-label="Reference Number :"
              primary-button-label="View details"
              secondary-button-label="Browse services"
              prefill-fields="{}"
              custom-illustration-size="Auto"
            ></sn-custom-embedx-voyager-catalog-item>
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