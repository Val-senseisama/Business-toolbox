

const hasPermission = ({ context, companyID, tasks }: { context: Record<string, any>, companyID: number, tasks: string[] }) => {
    if (!companyID) {
        return false;
    }
    if (!context || !context.id) {
        return false;
    }

    // Todo: check permissions
    return true;
}

export default hasPermission