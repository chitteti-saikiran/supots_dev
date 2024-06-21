import { DocumentNode } from "graphql";
import { useContext } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AppAuthContext } from "~/components/Root";
import { QueryHookOptions, QueryResult, MutationHookOptions, MutationTuple } from "react-apollo";

export const useSupotsuMutation = <T, V>(doc: DocumentNode, { variables, context, ...rest }: MutationHookOptions): MutationTuple<T, V> => {
  const { user } = useContext(AppAuthContext);
  return useMutation(doc, {
    ...rest,
    variables,
    context: {
      ...context,
      user: {
        _id: user._id,
        type: user.type
      }
    }
  })
}

export const useSupotsuQuery = <T, V>(doc: DocumentNode, { variables, context, ...rest }: QueryHookOptions): QueryResult<T, V> => {
  const { user } = useContext(AppAuthContext);
  return useQuery<T, any>(doc, {
    ...rest,
    variables,
    context: {
      ...context,
      user: {
        _id: user._id,
        type: user.type
      }
    }
  })
}
