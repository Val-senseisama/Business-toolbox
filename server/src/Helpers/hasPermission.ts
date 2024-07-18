

const hasPermission = ({ context, company_id, tasks }: { context: Record<string, any>, company_id: number, tasks: string[] }) => {
    if (!company_id) {
        return false;
    }
    if (!context || !context.id) {
        return false;
    }

    // Todo: check permissions
    return true;
}

export default hasPermission