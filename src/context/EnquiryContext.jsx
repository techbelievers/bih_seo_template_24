import React, { useCallback, useState } from "react";
import EnquiryDialog from "../components/EnquiryDialog";
import { EnquiryContext } from "../hooks/useEnquiry";

/**
 * One shared enquiry dialog for the whole app. Any component calls
 * openEnquiry("reason") — no per-section dialog copies or repeat
 * /header fetches like the old template.
 */
export const EnquiryProvider = ({ children }) => {
  const [intent, setIntent] = useState(null); // null = closed

  const openEnquiry = useCallback((reason = "Enquire Now") => {
    setIntent(reason);
  }, []);
  const close = useCallback(() => setIntent(null), []);

  return (
    <EnquiryContext.Provider value={openEnquiry}>
      {children}
      {intent !== null && <EnquiryDialog intent={intent} onClose={close} />}
    </EnquiryContext.Provider>
  );
};
