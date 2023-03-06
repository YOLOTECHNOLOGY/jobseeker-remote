
import { ReaderTPromise as M } from '../abstractModels/monads'
import { fetchConfigService } from "store/services/config/fetchConfig";
import { registInterpreter, Result } from '../abstractModels/util';

const interpreter = registInterpreter(command =>
    command.cata({
        fetchData: () => M(() =>
            fetchConfigService().then(data => Result.success({ config: data }))
                .catch(Result.error)
        ),
        prepareProps: M.of,
    }))

export default interpreter