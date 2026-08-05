import { useMutation } from "@tanstack/react-query";
import { createLead } from "./leadsApi";

export const useCreateLead = () => useMutation({
    mutationFn : createLead
})