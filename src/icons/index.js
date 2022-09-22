// 把应用的图标和操作图标分开
const req = require.context('./svg', false, /\.svg$/)
const reqApp = require.context('./appIcon', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
requireAll(reqApp)
