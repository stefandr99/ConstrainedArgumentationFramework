package com.af.argumentationframeworkapi.controllers;

import com.af.argumentationframeworkapi.models.ArgumentationFrameworkRequestModel;
import com.af.argumentationframeworkapi.models.ArgumentationFrameworkResponseModel;
import com.af.argumentationframeworkapi.models.CharacteristicFunctionRequestModel;
import com.af.argumentationframeworkapi.models.CharacteristicFunctionResponseModel;
import com.af.argumentationframeworkapi.services.IPropertiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/af")
public class ArgumentationFrameworkController {
    @Autowired
    private final IPropertiesService propertiesService;

    public ArgumentationFrameworkController(IPropertiesService propertiesService) {
        this.propertiesService = propertiesService;
    }

    @PostMapping("/")
    public ArgumentationFrameworkResponseModel props(@RequestBody ArgumentationFrameworkRequestModel requestModel) {
        return propertiesService.solve(requestModel);
    }

    @PostMapping("/characteristic")
    public CharacteristicFunctionResponseModel characteristic(@RequestBody CharacteristicFunctionRequestModel requestModel) {
        return propertiesService.characteristicFunction(requestModel);
    }
}
