type Action = Record<string, ActionContent>
export type ActionContent = {
  label: string
  value: string
  message: string
  actionMessage: string
}

export const actions = {
  login: {
    label: "Login",
    value: "login",
    message: "Already have an account?",
    actionMessage: "Login",
  },
  signup: {
    label: "Sign Up",
    value: "signup",
    message: "Don't have an account?",
    actionMessage: "Sign Up",
  },
} as Action
