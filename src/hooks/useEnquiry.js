import { createContext, useContext } from "react";

/** Opens the shared enquiry dialog: const openEnquiry = useEnquiry(); */
export const EnquiryContext = createContext(() => {});
export const useEnquiry = () => useContext(EnquiryContext);
