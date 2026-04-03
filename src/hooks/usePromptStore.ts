import { useReducer, useCallback } from "react";

export type PromptType =
  | "text-to-image"
  | "multimodal"
  | "inpainting"
  | "style-transfer"
  | "text-rendering";

export interface PromptLayers {
  subject: string;
  action: string;
  setting: string;
  composition: string;
  lighting: string;
  camera: string;
  color: string;
  material: string;
  style: string;
  textContent: string;
  textFont: string;
  textPlacement: string;
}

export type LayerKey = keyof PromptLayers;

export interface PromptState {
  type: PromptType;
  layers: PromptLayers;
}

type Action =
  | { kind: "SET_TYPE"; type: PromptType }
  | { kind: "SET_LAYER"; key: LayerKey; value: string }
  | { kind: "APPEND_LAYER"; key: LayerKey; value: string }
  | { kind: "LOAD_LAYERS"; layers: Partial<PromptLayers> }
  | { kind: "RESET" };

const emptyLayers: PromptLayers = {
  subject: "",
  action: "",
  setting: "",
  composition: "",
  lighting: "",
  camera: "",
  color: "",
  material: "",
  style: "",
  textContent: "",
  textFont: "",
  textPlacement: "",
};

const initialState: PromptState = {
  type: "text-to-image",
  layers: { ...emptyLayers },
};

function reducer(state: PromptState, action: Action): PromptState {
  switch (action.kind) {
    case "SET_TYPE":
      return { ...state, type: action.type };
    case "SET_LAYER":
      return {
        ...state,
        layers: { ...state.layers, [action.key]: action.value },
      };
    case "APPEND_LAYER": {
      const current = state.layers[action.key];
      const separator = current.length > 0 ? ", " : "";
      return {
        ...state,
        layers: {
          ...state.layers,
          [action.key]: current + separator + action.value,
        },
      };
    }
    case "LOAD_LAYERS":
      return {
        ...state,
        layers: { ...emptyLayers, ...action.layers },
      };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

export function usePromptStore() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setType = useCallback(
    (type: PromptType) => dispatch({ kind: "SET_TYPE", type }),
    []
  );
  const setLayer = useCallback(
    (key: LayerKey, value: string) =>
      dispatch({ kind: "SET_LAYER", key, value }),
    []
  );
  const appendLayer = useCallback(
    (key: LayerKey, value: string) =>
      dispatch({ kind: "APPEND_LAYER", key, value }),
    []
  );
  const loadLayers = useCallback(
    (layers: Partial<PromptLayers>) =>
      dispatch({ kind: "LOAD_LAYERS", layers }),
    []
  );
  const reset = useCallback(() => dispatch({ kind: "RESET" }), []);

  return { state, setType, setLayer, appendLayer, loadLayers, reset };
}
