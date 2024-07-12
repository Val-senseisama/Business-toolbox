
import { GraphQLError } from 'graphql';


const ThrowError = (message: string) => {
    throw new GraphQLError(message, {
        extensions: { code: 'USER' },
    });
};

export default ThrowError; 