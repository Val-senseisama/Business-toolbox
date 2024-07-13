import { GraphQLFormattedError } from 'graphql';
import { log } from '../Helpers/Helpers.js';
const formatError = (error: GraphQLFormattedError): GraphQLFormattedError => {
    // Don't give the specific errors to the client.
    if (error.message.startsWith('Database Error: ')) {
        return new Error('Internal server error');
    }

    if (error.extensions.code != 'USER') {
        log(error);
        return new Error('Internal server error');
    }
    return error;
}

export default formatError;